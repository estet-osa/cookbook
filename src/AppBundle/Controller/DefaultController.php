<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Recipe;
use AppBundle\Entity\RecipeVote;
use AppBundle\Form\CommentsType;
use Doctrine\ORM\Query\ResultSetMapping;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Form\RecipeType;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Ivory\CKEditorBundle\Form\Type\CKEditorType;

/**
 * Class DefaultController
 * @package AppBundle\Controller
 */
class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $list = $em->getRepository('AppBundle:Recipe')->findBy([
            'is_active' => true
        ]);

        return $this->render('AppBundle:Cookbook:list.html.twig', [
            'recipes' => $list
        ]);
    }

    /**
     * @Route("/new", name="new_cookbook")
     */
    public function newAction(Request $request)
    {
        $recipe = new Recipe();

        $form = $this->createFormBuilder($recipe)
            ->add('title', TextType::class)
            ->add('description', CKEditorType::class, array(
                'config' => array(
                    'filebrowserBrowseRoute'           => 'my_route',
                    'filebrowserBrowseRouteParameters' => array('slug' => 'my-slug'),
                    'filebrowserBrowseRouteAbsolute'   => true,
                    'filebrowserImageUploadUrl' => "upload_recipe_img",
                ),
            ))
            ->add('brochure', FileType::class)
            ->add('save', SubmitType::class)
            ->getForm();

        $form->handleRequest($request);
        $em = $this->getDoctrine()->getManager();

        if ($form->isSubmitted() && $form->isValid()){

            $recipe = $form->getData();

            /** @var Symfony\Component\HttpFoundation\File\UploadedFile $file */
            $file = $recipe->getBrochure();

            // Generate a unique name for the file before saving it
            $fileName = substr(md5(uniqid()), 0, 5) . '.' . $file->guessExtension();

            // Move the file to the directory where brochures are stored
            $file->move(
                $this->getParameter('images_directory'),
                $fileName
            );

            // Update the 'brochure' property to store the IMG file name
            // instead of its contents
            $recipe->setBrochure($fileName);

            $em->persist($recipe);
            $em->flush();

            return $this->redirect('/edit/' . $recipe->getId());
        }

        return $this->render('AppBundle:Cookbook:new.html.twig', array(
            'form' => $form->createView(),
        ));
    }

    /**
     * @Route("/show/{cookbookId}", name="showCookbook")
     */
    public function showAction($cookbookId, Request $request)
    {
        $em      = $this->getDoctrine()->getManager();
        $recipe  = $em->getRepository('AppBundle:Recipe')->find($cookbookId);
        $cmtForm = $form = $this->createForm(CommentsType::class, null, [
            'action' => $this->generateUrl('comment_add_route'),
        ]);

        if(!$recipe)
            throw $this->createNotFoundException('No recipe found for id ' . $cookbookId);

        $votes = $em->getRepository('AppBundle:RecipeVote')->findBy(['post' => $cookbookId]);

        //Set the client id from hash user agent & user ip
        $clientId = substr(md5($request->headers->get('User-Agent') .
            $request->getClientIp(true)), 0, 10);

        //Try get client ip from blog_vote table
        $issetClinetId = $em->getRepository('AppBundle:RecipeVote')->findOneBy(['client_id' => $clientId, 'post' => $cookbookId]);
        if(!$issetClinetId){
            $newVote = new RecipeVote();
            $newVote->setPost($recipe);
            $newVote->setClientId($clientId);

            $em->persist($newVote);
            $em->flush();
        }

        return $this->render('AppBundle:Cookbook:show.html.twig', [
            'recipe'    => $recipe,
            'clientId'  => $clientId,
            'votes'     => $votes,
            'cmtForm'   => $cmtForm->createView()
        ]);
    }

    /**
     * @Route("/edit/{cookbookId}", name="editCookbook")
     */
    public function editAction($cookbookId, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $recipe = $em->getRepository('AppBundle:Recipe')->find($cookbookId);

        if(!$recipe)
            throw $this->createNotFoundException('No recipe found for id ' . $recipe);

        $form = $this->createForm(RecipeType::class, $recipe);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $data = $form->getData();

            /** @var Symfony\Component\HttpFoundation\File\UploadedFile $file */
            $file = $recipe->getBrochure();

            // Generate a unique name for the file before saving it
            $fileName = substr(md5(uniqid()), 0, 5) . '.' . $file->guessExtension();

            // Move the file to the directory where brochures are stored
            $file->move(
                $this->getParameter('images_directory'),
                $fileName
            );

            // Update the 'brochure' property to store the IMG file name
            // instead of its contents
            $recipe->setBrochure($fileName);

            $em->persist($data);
            $em->flush();

            return $this->redirect('/show/' . $cookbookId);
        }

        return $this->render('AppBundle:Cookbook:edit.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @route("/recipe/find", name="search_recipe")
     * @Method("POST")
     */
    function findAction(Request $request)
    {
        $data = $request->request->get('data');
        $json = json_decode($data);
        $findString  = $json->searchStr;

        $em  = $this->getDoctrine()->getManager();
        $sql = "SELECT id, created, title, description, brochure FROM recipe
                WHERE title LIKE '%{$findString}%' AND is_active = 1";

        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('id', 'id');
        $rsm->addScalarResult('created', 'created');
        $rsm->addScalarResult('title', 'title');
        $rsm->addScalarResult('description', 'description');
        $rsm->addScalarResult('brochure', 'brochure');
        $rsm->addScalarResult('is_active', 'is_active');
        $query = $em->createNativeQuery($sql, $rsm);
        $recipe = $query->getResult();

        if ($recipe)
            return new JsonResponse($recipe);
        else
            return new Response('not_found');
    }

    /**
     * @route("/recipes/find", name="search_recipes")
     * @Method("POST")
     */
    function findListAction(Request $request)
    {
        $data = $request->request->get('data');
        $json = json_decode($data);
        $findString  = $json->searchStr;

        $arrayToStr = implode(',', $findString);

        $em = $this->getDoctrine()->getManager();
        $sql = "SELECT id, created, title, description, brochure FROM recipe
                WHERE id IN ({$arrayToStr}) AND is_active = 1";

        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('id', 'id');
        $rsm->addScalarResult('created', 'created');
        $rsm->addScalarResult('title', 'title');
        $rsm->addScalarResult('description', 'description');
        $rsm->addScalarResult('brochure', 'brochure');
        $rsm->addScalarResult('is_active', 'is_active');
        $query = $em->createNativeQuery($sql, $rsm);
        $recipe = $query->getResult();

        if ($recipe)
            return new JsonResponse($recipe);
        else
            return new Response('not_found');
    }

    /**
     * @route("/recipe/del{recipeId}", name="search")
     */
    function delAction($recipeId, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $recipe = $em->getRepository('AppBundle:Recipe')->find($recipeId);

        $recipe->setIsActive(false);
        $em->persist($recipe);
        $em->flush();

        return new Response($recipeId);
    }

    /**
     * @route("/jornal", name="jornal")
     */
    function jornalAction()
    {



        return $this->render('AppBundle:Jornal:list.html.twig');
    }

    /**
     * @Route("/recipe/vote", name="recipe_vote")
     * @Method("POST")
     */
    public function recipeVoteAction(Request $request)
    {
        $data = $request->request->get('data');

        /** @var bool $action */
        $action = ($data == 'like') ? 1 : 0;

        //Set the client id from hash user agent & user ip
        $clientId = substr(md5($request->headers->get('User-Agent') .
            $request->getClientIp(true)), 0, 10);

        $referer = explode('/', $request->headers->get('referer'));
        $blogId  = $referer[4] ?? false;

        $em = $this->getDoctrine()->getManager();
        $art = $em->getRepository('AppBundle:RecipeVote')->findOneBy([
            'client_id' => $clientId,
            'post'      => $blogId
        ]);

        if($art){
            $art->setUserVote($action);

            $em->persist($art);
            $em->flush();
        }

        return new Response('ok');
    }

}
